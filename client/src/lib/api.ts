import { CurrentUserResponseType } from "@/types/api.type";
import API from "./axios-client";

export const getCurrentUserQueryFn =
  async (): Promise<CurrentUserResponseType> => {
    const response = await API.get(`/user/current`);
    return response.data;
  };
