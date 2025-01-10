import { useHandleApiError } from "@/axios/handlerApiError";
import { isUserLogged, isUserUnlogged } from "@/utils/checkAuthentication";
import { useAlertsContext } from "@context/AlertsContext/useUserContext";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryAssociation } from "@data/stands/Association";
import { getAssociations } from "@service/stand/associationService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Associations() {
  const [associations, setAssociations] = useState<SummaryAssociation[]>([]);
  const { addNotification } = useAlertsContext();
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (isUserLogged(user)) {
        try {
          const associations = await getAssociations();
          setAssociations(associations);
        } catch (error) {
          handleApiError(error);
        }
      } else if (isUserUnlogged(user)) {
        navigate("/");
      }
    };
    fetchVoluntary();
  }, [user, navigate, handleApiError]);

  return <div></div>;
}

export default Associations;
