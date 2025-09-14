import { ApiResponse } from "@/types/apiResponse";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

 export const copyToClipboard = (url:string) => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(url)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy to clipboard"));
  } else {
    // Fallback for HTTP or old browsers
    const textArea = document.createElement("textarea");
    textArea.value = url;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy to clipboard");
    } finally {
      document.body.removeChild(textArea);
    }
  }
};

 export const handleSwitchChange = async (value: boolean, onChange: (val: boolean) => void) => {
  try {
    const { data } = await axios.post<ApiResponse>("/api/accepting-message", {


      acceptingMessage: value,
    });

    if (data?.success) {
      toast.success(data.message);
      onChange(value); // ✅ tell RHF about the change
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    const message =
      axiosError.response?.data.message || "Something went wrong !";
    toast.error(message);
  }
};
