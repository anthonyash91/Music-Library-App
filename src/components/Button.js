export default function Button({
  buttonClass,
  buttonType,
  buttonFunction,
  buttonIcon,
  buttonLabel
}) {
  return (
    <button className={buttonClass} type={buttonType} onClick={buttonFunction}>
      {buttonIcon}
      {buttonLabel}
    </button>
  );
}
