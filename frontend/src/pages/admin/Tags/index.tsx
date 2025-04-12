import styles from "./Tags.module.scss";
import Tag from "@data/stands/Tag";
import Logo from "@/assets/image/LogoStoreControl.png";
import { useCallback, useEffect, useReducer, useState } from "react";
import Button from "@/components/utils/Button";
import useTagService from "@service/stand/useTagService";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import {
  isAdmin,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@context/UserContext/useUserContext";
import { EditSVG, PlusSVG } from "@/assets/svg";
import PageSelect from "@/components/selects/PageSelect";
import FormTag from "./FormTag";
import { formReducer, initialFormState } from "@reducer/formReducer";
import { Link } from "react-router-dom";

const isColorDark = (hex: string) => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

function Tags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag>();
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [formState, formDispach] = useReducer(formReducer, initialFormState);
  const { getTags } = useTagService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const fetchTags = useCallback(async () => {
    const response = await getTags(page.number);
    if (response) {
      setTags(response.content);
      pageDispatch({
        type: "SET_PAGE_MAX",
        payload: response.page.totalPages,
      });
    }
  }, [page.number, getTags]);

  useEffect(() => {
    if (isUserLogged(user) && isAdmin(user)) {
      fetchTags();
    } else if (isUserUnlogged(user)) {
      navigate("/");
    }
  }, [user, navigate, fetchTags]);

  const handleFormShow = () => {
    formDispach({ type: "SET_FALSE" });
    fetchTags();
  };

  return (
    <div>
      <div className={styles.background}>
        <div className={styles.header}>
          <div className={styles.base}>
            <Link to="/workspace" className={styles.linkLogo}>
              <img
                src={Logo}
                alt="Logo: imagem circular com um rosto de raposa no meio"
              />
            </Link>
          </div>
          <div className={styles.menubase}>
            <div className={styles.menu}>
              <Button
                className={styles.newTag}
                onClick={() => formDispach({ type: "SET_CREATE" })}
              >
                <PlusSVG size={18} />
                <p>Tag</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <li key={"header"} className={styles.listHeader}>
          <p>Nome da tag</p>
          <p>Cor</p>
          <p className={styles.propAligned}>Editar</p>
        </li>
        <ul className={styles.main}>
          {tags.map((tag, index) => (
            <li
              key={tag.uuid}
              className={`${index % 2 === 0 ? styles.itemPair : styles.itemOdd}`}
            >
              <p>{tag.tagName}</p>
              <p>
                <span
                  style={{
                    backgroundColor: tag.color,
                    color: isColorDark(tag.color) ? "white" : "black",
                  }}
                >
                  {tag.color}
                </span>
              </p>
              <Button
                className={styles.tagEdit}
                onClick={() => {
                  formDispach({ type: "SET_UPDATE", payload: tag.uuid });
                  setSelectedTag(tag);
                }}
              >
                <EditSVG size={16} />
              </Button>
            </li>
          ))}
        </ul>
        <PageSelect
          value={page.number}
          max={page.max}
          dispatch={pageDispatch}
        />
        {formState.show && (
          <FormTag
            type={formState.type}
            hide={handleFormShow}
            tag={selectedTag}
          />
        )}
      </div>
    </div>
  );
}

export default Tags;
