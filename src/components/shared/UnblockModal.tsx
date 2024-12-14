import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

type TUnblockModalProps = {
  handleUnblockFunction: (id: string) => void;
  id: string;
  unblockAlertMessage: string;
};

const UnblockModal = ({
  handleUnblockFunction,
  id,
  unblockAlertMessage,
}: TUnblockModalProps) => {
  return (
    <div className="DeleteModalContainer">
      {/* delete button  */}

      <AlertDialog>
        {/* alert trigger  */}
        <AlertDialogTrigger asChild>
          <Button className="px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base bg-green-600 hover:bg-green-700 active:scale-95 duration-500">
            Unblock
          </Button>
        </AlertDialogTrigger>

        {/* alert content  */}
        <AlertDialogContent>
          {/* header and content type  */}
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className=" font-medium ">
              {unblockAlertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* bottom button type  */}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleUnblockFunction(id)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UnblockModal;
