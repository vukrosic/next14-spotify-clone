import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { UploadArea } from "@/components/upload-area";


export const AddSongModal = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" className="mr-4 text-white bg-slate-800">
                    Add
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-950 border-0">
                <UploadArea />
            </DialogContent>
        </Dialog>
    );
};