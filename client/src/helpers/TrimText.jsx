import React from "react";

const TrimText = ({ text, maxLength }) => {
    if (text.length <= maxLength) {
        return <span>{text}</span>;
    }   else {
        const trimmedText = text.substring(0, maxLength) + '...';
        return <span title={text}>{trimmedText}</span>;
    }
};
export default TrimText;