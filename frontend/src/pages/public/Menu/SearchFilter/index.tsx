import styles from './SearchFilter.module.scss';

interface OptionsFilterProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function SearchFilter({value, onChange}: OptionsFilterProps) {
  return (
    <div className={styles.background}>
      <input id="search" type="text" value={value} onChange={onChange}/>
      {/* <label htmlFor="search"></label> */}
    </div>
  );
}

export default SearchFilter;