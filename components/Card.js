import React from 'react'

export const Card = ({className, children}) => {
  return (
    <article className={`${className} shadow-inner-light bg-white rounded-[1.5em]`}>{children}</article>
  )
}

export const CardHeader = ({className, children}) => {
  return (
    <div className={`${className} relative text-white font-semibold w-full shadow-inner-light rounded-t-[1.5em] bg-color1`}>{children}</div>
  )
}

export const CardBody = ({className, children}) => {
  return (
    <div className={`${className} w-full rounded-b-[1.5em] bg-white`}>{children}</div>
  )
}