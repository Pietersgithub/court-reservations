import React, {FC} from "react";
import {Slot} from "../src/api";

type Props = {
    slot: Slot;
};

export const AccordionHeader: FC<Props> = (props: Props) => {

    if (props.slot.note && props.slot.note.length > 0) {
        return (
            <strong>
                PUBLIC EVENT
                <br/>
            </strong>
        )
    }

    return <></>
};
