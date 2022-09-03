import { useState } from 'react'

function ShowButton({ ...props }) {
  let content = props.content
  let className = props.className
  const [more, setMore] = useState(false)

  function onClick() {
    setMore(!more)
  }

  if (content && content.length < 100) {
    return (
      <>
        <p>{content}</p>
      </>
    )
  } else {
    return (
      <>
        {more ? content : `${content?.substring(0, 100)}`}
        <button className='btn-icon-filled' role='switch' onClick={onClick}>
          <span className='material-icons'>
            {' '}
            {more ? 'expand_less' : 'expand_more'}
          </span>
          {more ? 'less...' : 'more...'}
        </button>
      </>
    )
  }
}

export default ShowButton
