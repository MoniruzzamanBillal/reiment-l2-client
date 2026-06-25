"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type TProps = {
  showReplaceModal: boolean;
  setShowReplaceModal: (value: boolean) => void;
  handleReplaceCart: () => void;
};

const CartItemReplaceModal = ({
  showReplaceModal,
  setShowReplaceModal,
  handleReplaceCart,
}: TProps) => {
  return (
    <Dialog open={showReplaceModal} onOpenChange={setShowReplaceModal}>
      <DialogContent>
        <DialogTitle>Replace Cart Item</DialogTitle>
        <DialogDescription className="text-gray-700 font-medium">
          Your cart contains items from a different vendor. Would you like to
          replace them?
        </DialogDescription>
        <div className="flex gap-x-3">
          <Button
            onClick={() => setShowReplaceModal(false)}
            className="bg-prime50 hover:bg-prime100"
          >
            Close
          </Button>
          <Button
            onClick={handleReplaceCart}
            className="bg-prime50 hover:bg-prime100"
          >
            Replace
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartItemReplaceModal;
