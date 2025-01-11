import { useHandleApiError } from "@/axios/handlerApiError";
import { isAdmin, isUserLogged } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryAssociation } from "@data/stands/Association";
import { getAssociations } from "@service/stand/associationService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Associations() {
  const [associations, setAssociations] = useState<SummaryAssociation[]>([]);
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (isUserLogged(user)) {
        try {
          const response = await getAssociations();
          setAssociations(response.content);
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
      {associations.map((association) => (
        <div key={association.uuid}>{association.associaitonName}</div>
      ))}
    </div>
  );
}

export default Associations;
