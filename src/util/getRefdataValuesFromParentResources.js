export default function getRefdataValuesFromParentResources(parentResources, refdataCat) {
  const { refdata } = parentResources;
  return refdata?.records?.filter(obj => obj.desc === refdataCat)[0]?.values?.map(obj => ({ value: obj.id, label: obj.label })) || [];
}
