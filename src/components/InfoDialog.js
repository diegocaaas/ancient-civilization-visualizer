import { CivilizationsContext} from "../App";
import { useContext, useRef } from "react";

const InfoDialog = () => {
    const { pickedCivilization, dialogRef, isDialogOpen, toggleDialog } = useContext(CivilizationsContext);
    
    const handleClose = () => {
        if(dialogRef.current && isDialogOpen) {
            dialogRef.current.close();
            toggleDialog(false);
        }
    }

    return (
        <dialog id="infoDialog" ref={dialogRef}>
            {pickedCivilization && <h1> {pickedCivilization.name}</h1>}
            {pickedCivilization && <p> {pickedCivilization.description} </p>}
            <button onClick={handleClose}> Close</button>
        </dialog>
    );
}

export default InfoDialog;

