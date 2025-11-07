import useWorkfileStore from './useWorkfileStore';

export function TestUndoRedo() {
  const theme = useWorkfileStore((state) => state.themeModifications);
  const updateTheme = useWorkfileStore((state) => state.setThemeModifications);
  const temporalState = useWorkfileStore.temporal.getState();

  console.log('=== Workfile Undo/Redo Test ===');
  console.log('Initial theme:', theme);
  console.log('Can undo:', temporalState.pastStates.length > 0);
  console.log('Can redo:', temporalState.futureStates.length > 0);

  // Test 1: Update theme multiple times
  const test1 = () => {
    console.log('\n--- Test 1: Multiple updates ---');
    
    updateTheme({ palette: { primary: { main: '#ff0000' } } });
    console.log('After update 1 - History size:', useWorkfileStore.temporal.getState().pastStates.length);
    
    updateTheme({ palette: { primary: { main: '#00ff00' } } });
    console.log('After update 2 - History size:', useWorkfileStore.temporal.getState().pastStates.length);
    
    updateTheme({ palette: { primary: { main: '#0000ff' } } });
    console.log('After update 3 - History size:', useWorkfileStore.temporal.getState().pastStates.length);
  };

  // Test 2: Undo
  const test2 = () => {
    console.log('\n--- Test 2: Undo ---');
    console.log('Before undo:', useWorkfileStore.getState().themeModifications);
    useWorkfileStore.temporal.getState().undo();
    console.log('After undo:', useWorkfileStore.getState().themeModifications);
  };

  // Test 3: Redo
  const test3 = () => {
    console.log('\n--- Test 3: Redo ---');
    console.log('Before redo:', useWorkfileStore.getState().themeModifications);
    useWorkfileStore.temporal.getState().redo();
    console.log('After redo:', useWorkfileStore.getState().themeModifications);
  };

  const canUndo = temporalState.pastStates.length > 0;
  const canRedo = temporalState.futureStates.length > 0;

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Undo/Redo Test Suite</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={test1}>Test 1: Multiple Updates</button>
        <button onClick={test2} disabled={!canUndo}>Test 2: Undo</button>
        <button onClick={test3} disabled={!canRedo}>Test 3: Redo</button>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Current State:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px' }}>
          {JSON.stringify(theme, null, 2)}
        </pre>
        <p>Can Undo: {canUndo ? '✅' : '❌'} ({temporalState.pastStates.length} states)</p>
        <p>Can Redo: {canRedo ? '✅' : '❌'} ({temporalState.futureStates.length} states)</p>
      </div>
    </div>
  );
}
