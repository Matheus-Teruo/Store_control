import React from 'react'

const regexnumber = /[0-9]/
const regexspace = /\s/
const regexspecial = /["]|[']|[\\]|[/]|[.]/

function Stands() {
  const [observaiton, setObservaiton] = useState("")
  const [Check, setCheck] = useState({
    haveMinChar: false,
    noNumber: true,
    noSpace: true, 
    noSpecialChar: true});
  const [submitvalid, setSubmitvalid] = useState(false);

  const handleObservationChange = (event) => {  // Username conditions
    setObservaiton(event.target.value);
    prop.output(event.target.value);

    if (event.target.value.trim().length >= 4) {  // Check min number of char
      setCheck(Check => ({...Check, haveMinChar: true})
    )} else {
      setCheck(Check => ({...Check, haveMinChar: false})
    )};

    if (!regexnumber.test(event.target.value)) {  // Check use of number
      setCheck(Check => ({...Check, noNumber: true})
    )} else {
      setCheck(Check => ({...Check, noNumber: false})
    )};

    if (!regexspace.test(event.target.value)) {  // Check use of space
      setCheck(Check => ({...Check, noSpace: true})
    )} else {
      setCheck(Check => ({...Check, noSpace: false})
    )};

    if (!regexspecial.test(event.target.value)) {  // Check use of special char
      setCheck(Check => ({...Check, noSpecialChar: true})
    )} else {
      setCheck(Check => ({...Check, noSpecialChar: false})
    )};
  };

  return (
    <div>Stands</div>
  )
}

export default Stands