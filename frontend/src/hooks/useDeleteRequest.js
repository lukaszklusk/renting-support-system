import useAxiosUser from "./useAxiosUser";

const useDeleteRequest = () => {
  const axiosUser = useAxiosUser();

  const deleteData = async (url) => {
    try {
      const response = await axiosUser.delete(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      console.log("error deleting data", err);
      throw err;
    }
  };
  return deleteData;
};

export default useDeleteRequest;
