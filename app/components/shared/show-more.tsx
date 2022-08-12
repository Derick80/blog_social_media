import { useState } from "react";
import Button from "~/components/shared/button";

function ShowButton({ ...props }) {
  let content = props.content;
  let className = props.className;
  const [more, setMore] = useState(false);

  function onClick() {
    setMore(!more);
  }

  if (content && content.length < 100) {
    return (
      <>
        <p>{content}</p>
      </>
    );
  } else {
    return (
      <>
        {more ? content : `${content?.substring(0, 100)}`}
        <Button className="btn-icon-filled" role="switch" onClick={onClick}>
          <span className="material-icons">
            {" "}
            {more ? "expand_less" : "expand_more"}
          </span>
          {more ? "less..." : "more..."}
        </Button>
      </>
    );
  }
}

export default ShowButton;
