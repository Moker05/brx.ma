import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from '../../components/composite/StatCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

describe('StatCard Component', () => {
  it('should render stat card with all props', () => {
    render(
      <StatCard
        title="MASI Index"
        value="13,450.25"
        change="+2.5%"
        trend="up"
        icon={TrendingUp}
      />
    );

    expect(screen.getByText('MASI Index')).toBeInTheDocument();
    expect(screen.getByText('13,450.25')).toBeInTheDocument();
    expect(screen.getByText('+2.5%')).toBeInTheDocument();
  });

  it('should render with positive trend styling', () => {
    const { container } = render(
      <StatCard
        title="Test"
        value="100"
        change="+5%"
        trend="up"
        icon={TrendingUp}
      />
    );

    const changeElement = screen.getByText('+5%');
    expect(changeElement).toHaveClass('text-success');
  });

  it('should render with negative trend styling', () => {
    const { container } = render(
      <StatCard
        title="Test"
        value="100"
        change="-3%"
        trend="down"
        icon={TrendingDown}
      />
    );

    const changeElement = screen.getByText('-3%');
    expect(changeElement).toHaveClass('text-error');
  });

  it('should render without change value', () => {
    render(
      <StatCard
        title="Test"
        value="100"
        icon={TrendingUp}
      />
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
