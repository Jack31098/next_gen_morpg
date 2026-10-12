// Fictional design arithmetic, not an engine simulation or balance benchmark.
// Run: node docs/design/experiments/material_interaction_checks.cjs
const checks = [];
function check(condition, label) {
  if (!condition) throw new Error(`Design check failed: ${label}`);
  checks.push(label);
}
const near = (a, b) => Math.abs(a - b) < 1e-8;
function transfer(source, bound, capacity, requested) {
  const moved = Math.min(source, Math.max(0, capacity - bound), Math.max(0, requested));
  return { source: source - moved, bound: bound + moved, moved };
}
const support = (aether, coupling, order, field) => aether * coupling * order * field;
const relax = (initial, target, elapsed, tau) => target + (initial - target) * Math.exp(-elapsed / tau);

// Different receivers compete for one finite source. Capacity cannot create matter.
const first = transfer(3, 0, 2, 10);
const second = transfer(first.source, 0, 2, 10);
const repeated = transfer(second.source, first.bound, 2, 10);
check(near(repeated.source + repeated.bound + second.bound, 3), 'finite-source conservation');
check(near(first.bound, 2) && near(second.bound, 1) && near(repeated.moved, 0), 'capacity and no duplicate allocation');

// Same phase, state, field, total geometry, and binding capacity before/after partition.
const whole = support(4, 1, 0.8, 1);
const pieces = support(1, 1, 0.8, 1) + support(3, 1, 0.8, 1);
check(near(whole, pieces), 'splitting does not create support');
check(near(2 / 4, 0.5 / 1), 'condensate coverage is intensive');
const reagentSupport = support(2, 0, 1, 1);
check(near(reagentSupport, 0) && near(first.bound, 2), 'capturing aether does not imply flotation');

// C coverage is 0 or 1. Time, force, and quantity scales are illustrative design units.
const ordinaryRetention = relax(1, 0, 10, 10);
const stabilizedRetention = relax(1, 0, 10, 50);
const ordinaryRetuning = relax(0, 1, 1, 1);
const stabilizedRetuning = relax(0, 1, 1, 5);
check(stabilizedRetention > ordinaryRetention, 'C improves state retention');
check(stabilizedRetuning < ordinaryRetuning, 'C slows intentional retuning');
check(near(relax(relax(1, 0, 4, 50), 0, 6, 50), stabilizedRetention), 'constant-condition time segmentation');

// State retention cannot replace A lost through a leak.
const stableBeforeLeak = support(4, 1, stabilizedRetention, 1);
const stableAfterLeak = support(2, 1, stabilizedRetention, 1);
check(near(stableAfterLeak, stableBeforeLeak / 2), 'state stabilization does not replace leaked aether');

// No field-screening mechanism has been defined. A nearby particle trap leaves H unchanged.
check(near(whole, support(4, 1, 0.8, 1)), 'free-aether trap is not automatically a field shield');
const trap = transfer(1.5, 0, 2, 1.5);
const nextPulse = transfer(1.5, trap.bound, 2, 1.5);
check(near(trap.source, 0) && near(nextPulse.source, 1), 'flow interception has finite capacity');

console.log(JSON.stringify({
  scope: 'Illustrative arithmetic only; no reaction kinetics, world simulation, or balance proof',
  checks_passed: checks.length,
  checks,
  finite_source: { input_a: 3, first_receiver_a: first.bound, second_receiver_a: second.bound, remaining_a: repeated.source },
  equal_composition_support: { rock: support(2, 1, 1, 1), reagent: reagentSupport },
  condensate_tradeoff: {
    order_after_10_without_C: ordinaryRetention,
    order_after_10_with_C: stabilizedRetention,
    retuning_after_1_without_C: ordinaryRetuning,
    retuning_after_1_with_C: stabilizedRetuning,
  },
  leakage: { before: stableBeforeLeak, after_half_A_lost: stableAfterLeak },
  trap_second_pulse_breakthrough_a: nextPulse.source,
}, null, 2));
