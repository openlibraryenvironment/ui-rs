export default function stateString(state) {
  if (!state) return '';
  const s = state.code.replace(/^REQ_/, '').replace(/_/g, ' ');
  return s[0].toUpperCase() + s.substring(1).toLowerCase();
}
