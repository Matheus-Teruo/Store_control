import React from 'react'

function History(props) {
  return (
    <svg fill="none"
    width={`${props.size || "24"}px`}
    height={`${props.size || "24"}px`}
    viewBox="0 0 24 24"
    stroke="#000000"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round">
    <path d="M3 3v5h5" />
    <path d="M3.05 13A9 9 0 106 5.3L3 8" />
    <path d="M12 7v5l4 2" />
    </svg>
  )
}

export default History