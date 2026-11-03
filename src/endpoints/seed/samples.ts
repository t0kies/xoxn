// Code for the code scenes, in two languages.
export const DEMO_CPP = `// Lorem ipsum: read the sensor, smooth it, report when it changes.
float smooth(float previous, float sample) {
  return previous * 0.8f + sample * 0.2f;
}

void loop() {
  static float level = 0;
  level = smooth(level, analogRead(SENSOR_PIN) / 4095.0f);
  if (fabs(level - lastReported) > 0.02f) report(level);
}`

export const DEMO_TSX = `// Dolor sit amet: a list that works offline and syncs later.
export function List({ items }: { items: Item[] }) {
  const pending = useOutbox()
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} data-pending={pending.has(item.id)}>{item.name}</li>
      ))}
    </ul>
  )
}`
