import { useHandleApiError } from "@/axios/handlerApiError";
import { isAdmin, isUserLogged } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryVoluntary } from "@data/volunteers/Voluntary";
import { getVolunteers } from "@service/voluntary/voluntaryService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Volunteers() {
  const [volunteers, setVolunteers] = useState<SummaryVoluntary[]>([]);
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (isUserLogged(user)) {
        try {
          const response = await getVolunteers();
          setVolunteers(response.content);
        } catch (error) {
          handleApiError(error);
        }
      } else if (isAdmin(user)) {
        navigate("/");
      }
    };
    fetchVoluntary();
  }, [user, navigate, handleApiError]);

  return (
    <div>
      {volunteers.map((voluntary) => (
        <div key={voluntary.uuid}>{voluntary.fullname}</div>
      ))}
    </div>
  );
}

export default Volunteers;
