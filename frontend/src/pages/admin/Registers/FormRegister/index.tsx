import styles from "./FormRegister.module.scss";
import Button from "@/components/utils/Button";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import {
  createRegisterPayload,
  initialRegisterState,
  registerReducer,
  updateRegisterPayload,
} from "@reducer/register/registerReducer";
import useRegisterService from "@service/registers/useRegisterService";
import { useEffect, useReducer, useState } from "react";
import Input from "@/components/utils/ProductInput";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import { CheckSVG, XSVG } from "@/assets/svg";
import GlassBackground from "@/components/GlassBackground";
import Register from "@data/registers/Register";
import { isApiError, mapFieldErrors } from "@/utils/checkApiResponse";
import ApiError from "@data/Error";

type FormRegisterProps = {
  type: "create" | "update";
  hide: () => void;
  uuid?: string;
};

function FormRegister({ type, hide, uuid }: FormRegisterProps) {
  const [state, dispatch] = useReducer(registerReducer, initialRegisterState);
  const [initial, setInitial] = useState<Register>();
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [waitingFetch, setWaitingFetch] = useState<
    "create/update" | "delete" | ""
  >("");
  const [touched, setTouched] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<Record<string, string>>({});
  const { addNotification } = useAlertsContext();
  const { getRegister, createRegister, updateRegister, deleteRegister } =
    useRegisterService();

  useEffect(() => {
    const fetchRegister = async () => {
      if (type === "update" && uuid) {
        const register = await getRegister(uuid);
        dispatch({ type: "SET_REGISTER", payload: register });
        setInitial(register);
      } else if (type === "update" && uuid === undefined) {
        console.error("uuid need to be defined when type is update");
      }
    };

    fetchRegister();
  }, [uuid, type, getRegister]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setWaitingFetch("create/update");
      setTouched(false);
      const register = await createRegister(createRegisterPayload(state));
      addNotification({
        title: "Create Stand Success",
        message: `Create stand: ${register.registerName}, with stand: ${register.summaryStand !== undefined ? register.summaryStand.standName : "não definido"}`,
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
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initial) {
      try {
        setWaitingFetch("create/update");
        setTouched(false);
        const register = await updateRegister(
          updateRegisterPayload(state, initial),
        );
        addNotification({
          title: "Update Register Success",
          message: `Update register: ${register.registerName}, with president: ${register.summaryStand !== undefined ? register.summaryStand.standName : "não definido"}`,
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
        await deleteRegister(state.uuid);
        addNotification({
          title: "Delete Register Success",
          message: `Delete Register: ${state.registerName}`,
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
        <h3>{type === "create" ? "Criar Caixa" : "Editar Caixa"}</h3>
        <form
          onSubmit={type === "create" ? handleCreateSubmit : handleUpdateSubmit}
        >
          <label>Nome do caixa</label>
          <Input
            type="text"
            id="registerName"
            value={state.registerName}
            onChange={(e) =>
              dispatch({ type: "SET_REGISTER_NAME", payload: e.target.value })
            }
            showStatus={touched}
            message={messageError["registerName"]}
            isRequired
          />
          {type !== "create" ? (
            <>
              <label>Estande</label>

              <p className={styles.standField}>
                {initial &&
                  (initial.summaryStand
                    ? initial.summaryStand.standName
                    : "Não atrelado")}
              </p>
            </>
          ) : (
            <label>
              Neste modo o site não permite atrelar caixa ao estande
            </label>
          )}
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

export default FormRegister;
