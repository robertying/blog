import dayjs from "dayjs";
import { useEffect, useState } from "react";

export interface DateProps {
  className?: string;
  dateString: string;
}

const Date: React.FC<React.PropsWithChildren<DateProps>> = ({
  className,
  dateString,
}) => {
  const [dateDisplay, setDateDisplay] = useState("...");

  useEffect(() => {
    setDateDisplay(dayjs(dateString).format("MMM D, YYYY"));
  }, [dateString]);

  return (
    <time className={className} dateTime={dateString}>
      {dateDisplay}
    </time>
  );
};

export default Date;
