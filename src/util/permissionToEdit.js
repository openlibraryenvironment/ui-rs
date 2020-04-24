export default function permissionToEdit(stripes, record) {
  return (stripes.hasPerm('directory.edit-all') ||
          (stripes.hasPerm('directory.edit-self') &&
           record?.status?.value === 'managed'));
}
