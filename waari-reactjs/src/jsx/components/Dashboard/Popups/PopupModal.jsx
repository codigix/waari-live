import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function PopupModal({ open, onDialogClose, children ,dialogClass }) {
	return (
		<Dialog
			style={{ background: "#343434d4" }}
			open={open}
			TransitionComponent={Transition}
			keepMounted
			onClose={(e, reason) => {
				if (reason === "backdropClick" || reason === "escapeKeyDown") {
					return;
				} else {
					return onDialogClose(false);
				}
			}}
			aria-describedby="alert-dialog-slide-description"
			className={dialogClass}
			
		>
			<DialogContent className='w-full max-w-md card-bg-border  !p-10 gap-5 !border-primaryGray-700 !rounded-xl flex flex-col dialog-close'>
				<span onClick={() => onDialogClose(false)} className="close-popup">
					X
				</span>
				{children}
			</DialogContent>
		</Dialog>
	);
}
