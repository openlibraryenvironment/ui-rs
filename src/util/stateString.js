export default function stateString(state) {
  if (!state) return '';
  const s = state.code.replace(/^RE[QS]_/, '').replace(/_/g, ' ');
  return s[0].toUpperCase() + s.substring(1).toLowerCase().replace('reshare', 'ReShare');
}
