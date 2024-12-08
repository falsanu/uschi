import { UschiConfigurator } from '@/components/UschiConfigurator/UschiConfigurator';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';

export function HomePage() {
  return (
    <>
      <Welcome />
      <UschiConfigurator/>
    </>
  );
}