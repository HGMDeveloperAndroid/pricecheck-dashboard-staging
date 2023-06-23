import React from "react";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import s from "./list-report.module.scss"
import PageTitle from "../pageTitle/PageTitle";

const ListReportTypes = (props: Props) => {
  const { reportTypes } = props;
  return (
    <div className={s.container}>
      <PageTitle title="Reportes" />
      {reportTypes.map(report => {
        const { onClick, id, title } = report;
        return (
          <div className={s.reportTypeItem} onClick={() => onClick(id)}>
            <FontAwesomeIcon
              className={s.icon} icon={faMapMarkerAlt}
            />
            <p className={s.label}>{title}</p>
          </div>
        );
      })}
    </div>
  );
};

type Props = {
  reportTypes: Array<Report>;
};

type Report = {
  id: number;
  icon: string;
  title: string;
  onClick: Function;
};
export default ListReportTypes;
