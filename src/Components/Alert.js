import React from 'react'

export default function Alert(props) {
  const capitalize = (word) => {
    if (word === 'danger') {
      return "Error";
    }
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  return (
    props.alert && 
    <div className="fixed inset-x-0 top-24 mx-auto max-w-md">
      <div className="bg-yellow-200 border border-yellow-300 text-yellow-800 px-4 py-3 rounded relative flex justify-between items-center shadow-lg" role="alert">
        <strong>{capitalize(props.alert.type)}: {props.alert.msg}</strong>
        <button 
          type="button" 
          className="text-yellow-800 hover:text-yellow-600 focus:outline-none" 
          onClick={() => props.dismissAlert()} 
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  )
}
