import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./dialog";

const CartItemReplaceModal = ({
  showReplaceModal,
  setShowReplaceModal,
  handleReplaceCart,
}) => {
  return (
    <div className="mendorChangeModalContainer">
      {/* delete button  */}

      <Dialog open={showReplaceModal} onOpenChange={setShowReplaceModal}>
        <DialogContent className="modal-content">
          <DialogTitle>Replace Cart Item</DialogTitle>
          <DialogDescription className=" text-gray-700 font-medium ">
            Your cart contains items from a different vendor. Would you like to
            replace them?
          </DialogDescription>
          <div className="modal-actions flex gap-x-3 ">
            <Button
              onClick={() => setShowReplaceModal(false)}
              className=" bg-prime50 hover:bg-prime100 "
            >
              Close
            </Button>
            <Button
              onClick={() => handleReplaceCart()}
              className=" bg-prime50 hover:bg-prime100 "
            >
              Replace
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartItemReplaceModal;
