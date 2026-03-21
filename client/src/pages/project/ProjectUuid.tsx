import { useParams } from "react-router";

export default function ProjectUuid() {
  const { uuid } = useParams();
  return <div>ProjectUuid: {uuid}</div>;
}
