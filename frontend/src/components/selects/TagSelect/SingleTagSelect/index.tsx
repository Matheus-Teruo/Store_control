import styles from "./SingleTagSelect.module.scss";
import { useEffect, useState } from "react";
import Tag from "@data/stands/Tag";
import useTagService from "@service/stand/useTagService";
import { isColorDark } from "@/utils/colorTextTag";

interface TagSelectProps {
  value: string | undefined;
  onChange: (event: string | undefined) => void;
}

function SingleTagSelect({ value, onChange }: TagSelectProps) {
  const [listTags, setListTags] = useState<Tag[]>([]);
  const { getListTags } = useTagService();

  useEffect(() => {
    const fetchTags = async () => {
      const tags = await getListTags();
      if (tags) setListTags(tags);
    };
    fetchTags();
  }, [getListTags]);

  const handleChangeCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(value === event.target.value ? undefined : event.target.value);
  };

  return (
    <ul className={styles.checkBackground}>
      {listTags.map((tag) => (
        <label
          key={tag.uuid}
          className={`${tag.uuid === value && styles.selected}`}
          style={{
            backgroundColor: tag.color,
            color: isColorDark(tag.color) ? "white" : "black",
          }}
        >
          <input
            type="checkbox"
            name="tags"
            value={tag.uuid}
            checked={value === tag.uuid}
            onChange={handleChangeCheck}
          />
          <span>{tag.tagName}</span>
        </label>
      ))}
    </ul>
  );
}

export default SingleTagSelect;
