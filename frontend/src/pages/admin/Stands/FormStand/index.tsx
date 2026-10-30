import styles from "./FormStand.module.scss";
import Button from "@/components/utils/Button";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import {
  createStandPayload,
  initialStandState,
  standReducer,
  updateStandPayload,
} from "@reducer/stand/standReducer";
import useStandService from "@service/stand/useStandService";
import useRegisterService from "@service/registers/useRegisterService";
import { useEffect, useReducer, useState } from "react";
import AssociationSelect from "@/components/selects/AssociationSelect";
import Input from "@/components/utils/ProductInput";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import { CheckSVG, XSVG } from "@/assets/svg";
import GlassBackground from "@/components/GlassBackground";
import Stand from "@data/stands/Stand";
import activeConfig from "@/config/activeConfig";
import ApiError from "@data/Error";
import { isApiError, mapFieldErrors } from "@/utils/checkApiResponse";

type FormStandProps = {
  type: "create" | "update";
  hide: () => void;
  uuid?: string;
};

function FormStand({ type, hide, uuid }: FormStandProps) {
  const [state, dispatch] = useReducer(standReducer, initialStandState);
  const [initial, setInitial] = useState<Stand>();
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [waitingFetch, setWaitingFetch] = useState<
    "create/update" | "delete" | ""
  >("");
  const [touched, setTouched] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<Record<string, string>>({});
  const { addNotification } = useAlertsContext();
  const { getStand, createStand, updateStand, deleteStand } = useStandService();
  const { createRegister } = useRegisterService();

  useEffect(() => {
    const fetchStand = async () => {
      if (type === "update" && uuid) {
        const stand = await getStand(uuid);
        dispatch({ type: "SET_STAND", payload: stand });
        setInitial(stand);
      } else if (type === "update" && uuid === undefined) {
        console.error("uuid need to be defined when type is update");
      }
    };

    fetchStand();
  }, [uuid, type, getStand]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setWaitingFetch("create/update");
      setTouched(false);
      const stand = await createStand(createStandPayload(state));
      addNotification({
        title: "Create Stand Success",
        message: `Create stand: ${stand.standName}, with president: ${stand.association.associationName}`,
        type: MessageType.OK,
      });

      if (!activeConfig.enableToken) {
        try {
          const register = await createRegister({
            registerName: stand.standName + " Register",
            standUuid: stand.uuid,
          });
          addNotification({
            title: "Create Stand Success",
            message: `Create stand: ${register.registerName}, with stand: ${register.summaryStand !== undefined ? register.summaryStand.standName : "não definido"}`,
            type: MessageType.OK,
          });
        } catch (error: ApiError | any) {
          if (isApiError(error)) setMessageError(mapFieldErrors(error.fields));
        }
      }
      dispatch({ type: "RESET" });
      hide();
    } catch (error: ApiError | any) {
      if (isApiError(error)) setMessageError(mapFieldErrors(error.fields));
    } finally {
      setTouched(true);
      setWaitingFetch("");
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initial) {
      try {
        setWaitingFetch("create/update");
        setTouched(false);
        const stand = await updateStand(updateStandPayload(state, initial));
        addNotification({
          title: "Update Stand Success",
          message: `Update stand: ${stand.standName}, with president: ${stand.association.associationName}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        hide();
      } catch (error: ApiError | any) {
        if (isApiError(error)) setMessageError(mapFieldErrors(error.fields));
      } finally {
        setTouched(true);
        setWaitingFetch("");
      }
    }
  };

  const handleDeleteSubmit = async () => {
    if (uuid) {
      try {
        setWaitingFetch("delete");
        await deleteStand(state.uuid);
        addNotification({
          title: "Delete Stand Success",
          message: `Delete stand: ${state.standName}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        setConfirmDelete(false);
        hide();
      } finally {
        setWaitingFetch("");
      }
    }
  };

  return (
    <>
      <div className={styles.main}>
        <h3>{type === "create" ? "Criar Estande" : "Editar Estande"}</h3>
        <form
          onSubmit={type === "create" ? handleCreateSubmit : handleUpdateSubmit}
        >
          <label>Nome do estande</label>
          <Input
            type="text"
            id="standName"
            value={state.standName}
            onChange={(e) =>
              dispatch({ type: "SET_STAND_NAME", payload: e.target.value })
            }
            showStatus={touched}
            message={messageError["standName"]}
            isRequired
          />
          <label>Associação</label>
          <AssociationSelect
            value={state.associationUuid}
            onChange={(e) =>
              dispatch({
                type: "SET_ASSOCIATION_UUID",
                payload: e.target.value,
              })
            }
            showStatus={touched}
            message={messageError["associationUuid"]}
          />
          <div className={styles.footerButtons}>
            {type === "update" && !confirmDelete && (
              <Button onClick={() => setConfirmDelete(true)}>Excluir</Button>
            )}
            {confirmDelete && (
              <div className={styles.deleteBody}>
                <span>Excluir?</span>
                <Button
                  className={styles.buttonCancelDelete}
                  onClick={() => setConfirmDelete(false)}
                >
                  <XSVG size={16} />
                </Button>
                <Button
                  className={styles.buttonConfirmDelete}
                  onClick={handleDeleteSubmit}
                  loading={waitingFetch === "delete"}
                >
                  <CheckSVG size={16} />
                </Button>
              </div>
            )}
            <div />
            <Button
              type={ButtonHTMLType.Submit}
              loading={waitingFetch === "create/update"}
            >
              {type === "create" ? "Criar" : "Editar"}
            </Button>
          </div>
        </form>
      </div>
      <GlassBackground onClick={hide} />
    </>
  );
}

export default FormStand;
