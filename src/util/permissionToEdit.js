export default function permissionToEdit(stripes, record) {
  return (stripes.hasPerm('ui-directory.edit-all') ||
          stripes.hasPerm('ui-directory.edit-local') ||
          (stripes.hasPerm('ui-directory.edit-self') &&
           record?.status?.value === 'managed'));
}
