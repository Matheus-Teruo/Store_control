import { useHandleApiError } from "@/axios/handlerApiError";
import { isAdmin, isUserLogged } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryStand } from "@data/stands/Stand";
import { getStands } from "@service/stand/standService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Stands() {
  const [stands, setStands] = useState<SummaryStand[]>([]);
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (isUserLogged(user)) {
        try {
          const response = await getStands();
          setStands(response.content);
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
      {stands.map((stand) => (
        <div key={stand.uuid}>{stand.standName}</div>
      ))}
    </div>
  );
}

export default Stands;
