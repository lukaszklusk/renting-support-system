import useAxiosUser from "./useAxiosUser";

const usePostRequest = () => {
  const axiosUser = useAxiosUser();

  const postData = async (url, payload) => {
    try {
      const response = await axiosUser.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  };
  return postData;
};

export default usePostRequest;
