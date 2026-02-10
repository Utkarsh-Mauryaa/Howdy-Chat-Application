import { transformImage } from "../../lib/features";
import { MdOutlineFileOpen } from "react-icons/md";

const RenderAttachment = (file, url) => {

    switch (file) {
        case "video":
           return  <video src={url} preload='none' width={"200px"} controls />
            
        case "image":
            return <img src={transformImage(url, 200)} alt="Attachment" className="object-contain w-[200px] h-[150px]" />
            
        case "audio":
            return <audio src={url} preload='none' controls />
            

        default:
            return <MdOutlineFileOpen />;
    }

}

export default RenderAttachment
