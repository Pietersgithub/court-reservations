import {getUserFromStorage} from "./user";

export type Slot = {
    date: string; // date in format Y-m-d
    index: number; // slot index 0-95
    status: "free" | "taken" | "maintenance" | "history";
    owner?: string;
}

export type Day = {
    date: string,
    slots: Slot[] // always 96 slots
}

export type TimeTable = {
    timeTable: Day[]
}

export type Reservation = {
    date: string; // date in format Y-m-d
    slotFrom: number;
    slotTo: number;
    owner?: string; // name of the booking owner
}

export type AvailableReservations = {
    possibilities: Reservation[];
}

export type LoginResponse = {
    name: string;
    username: string;
    jwt: string;
}


export async function fetchTimeTable(): Promise<TimeTable> {
    const user = getUserFromStorage()
    let res: Response
    if (user.logged) {
        res = await fetch("http://localhost:8081/api/private/v1/time-table", {
            headers: {
                "Authorization": `Bearer ${user.jwt}`
            }
        })
    } else {
        res = await fetch("http://localhost:8081/api/public/v1/time-table")
    }

    if (res.status !== 200) {
        throw Error("could not fetch data from API")
    }

    return await res.json()
}

export async function fetchAvailable(date: string, firstSlot: number): Promise<AvailableReservations> {
    const user = getUserFromStorage()
    const res = await fetch(`http://localhost:8081/api/private/v1/available/${date}/${firstSlot}`, {
        headers: {
            "Authorization": `Bearer ${user.jwt}`
        }
    })

    if (res.status !== 200) {
        throw Error("could not fetch data from API")
    }

    return await res.json()
}

export async function postReservation(date: string, slotFrom: number, slotTo: number): Promise<void> {
    const user = getUserFromStorage()
    const res = await fetch(`http://localhost:8081/api/private/v1/reservation`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.jwt}`
        },
        body: JSON.stringify({
            date: date,
            slotFrom: slotFrom,
            slotTo: slotTo,
        })
    })

    if (res.status !== 200) {
        throw Error("could not create reservation")
    }
}

export async function postLogin(username: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`http://localhost:8081/api/public/v1/user/login`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    })

    if (res.status !== 200) {
        throw Error("could not fetch data from API")
    }

    return await res.json()
}

export async function postRegister(username: string, password: string, name: string, code: string): Promise<boolean> {
    const res = await fetch(`http://localhost:8081/api/public/v1/user/register`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            username: username,
            password: password,
            code: code,
        })
    })

    if (res.status !== 200) {
        throw Error("could not register user")
    }

    return true
}
