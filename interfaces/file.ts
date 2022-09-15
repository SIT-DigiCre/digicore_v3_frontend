import { FileGetResponse } from "./api";

export type FileObject = {
  id: string;
  user_id: string;
  name: string;
  k_size: string;
  extension: string;
  is_public: boolean;
  created_at: Date;
  update_at: Date;
  url: string;
};
export const convertToFileObject = (response: FileGetResponse): FileObject => {
  return {
    id: response.id,
    user_id: response.user_id,
    name: response.name,
    k_size: response.k_size,
    extension: response.extension,
    is_public: response.is_public,
    created_at: new Date(response.created_at),
    update_at: new Date(response.update_at),
    url: response.url,
  };
};
