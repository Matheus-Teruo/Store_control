import styles from "./MultTagSelect.module.scss";
import useTagService from "@service/stand/useTagService";
import { useEffect, useState } from "react";
import Tag from "@data/stands/Tag";
import { InputStatus } from "@/components/utils/InputStatus";
import { XSVG } from "@/assets/svg";
import Button from "@/components/utils/Button";
import { isColorDark } from "@/utils/colorTextTag";

interface TagSelectProps {
  value: string[];
  onChangeAdd: (event: string) => void;
  onChangeDelete: (event: string) => void;
  showStatus?: boolean;
  message?: string;
}

function MultTagSelect({
  value,
  onChangeAdd,
  onChangeDelete,
  showStatus,
  message,
}: TagSelectProps) {
  const [listTags, setListTags] = useState<Tag[]>([]);
  const [status, setStatus] = useState<InputStatus>(InputStatus.Untouched);
  const { getListTags } = useTagService();

  useEffect(() => {
    const fetchTags = async () => {
      const tags = await getListTags();
      if (tags) setListTags(tags);
    };
    fetchTags();
  }, [getListTags]);

  useEffect(() => {
    if (showStatus) {
      if (message === "") {
        setStatus(InputStatus.Accepted);
      } else {
        setStatus(InputStatus.Rejected);
      }
    }
  }, [showStatus, message]);

  const handleAdd = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeAdd(event.target.value);
    setStatus(InputStatus.Untouched);
  };

  const handleDelete = (uuid: string) => {
    onChangeDelete(uuid);
    setStatus(InputStatus.Untouched);
  };

  const availableTags = listTags.filter((tag) => !value.includes(tag.uuid));
  const selectedTags = listTags.filter((tag) => value.includes(tag.uuid));

  return (
    <div
      className={`${styles.base}
          ${
            status === InputStatus.Accepted
              ? styles.unfocOK
              : status === InputStatus.Rejected && styles.unfocNO
          }`}
    >
      {value.length !== 0 && (
        <ul className={styles.selectedTags}>
          {selectedTags.map((tag) => (
            <span
              key={tag.uuid}
              className={styles.tagItem}
              style={{
                backgroundColor: tag.color,
                color: isColorDark(tag.color) ? "white" : "black",
              }}
            >
              <p>{tag.tagName}</p>
              <Button
                className={styles.removeButton}
                onClick={() => handleDelete(tag.uuid)}
              >
                <XSVG
                  size={16}
                  style={{
                    color: isColorDark(tag.color) ? "white" : "black",
                  }}
                />
              </Button>
            </span>
          ))}
        </ul>
      )}
      <select className={styles.select} onChange={handleAdd} value="">
        <option value="">-- adicionar tag --</option>
        {availableTags.map((tag) => (
          <option key={tag.uuid} value={tag.uuid}>
            {tag.tagName}
          </option>
        ))}
      </select>
      {status !== InputStatus.Untouched && message && (
        <span className={styles.messageError}>{message}</span>
      )}
    </div>
  );
}

export default MultTagSelect;
