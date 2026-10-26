
export type Outcome = {
  label: string;
  market: string;
  probability: number;
};

function poisson(k: number, lambda: number): number {
  let fact = 1;

  for (let i = 2; i <= k; i++) {
    fact *= i;
  }

  return Math.exp(-lambda) * Math.pow(lambda, k) / fact;
}

export function predictions(
  homeXg = 1.55,
  awayXg = 1.15
): Outcome[] {
  const scores: {
    h: number;
    a: number;
    p: number;
  }[] = [];

  for (let h = 0; h <= 8; h++) {
    for (let a = 0; a <= 8; a++) {
      scores.push({
        h,
        a,
        p: poisson(h, homeXg) * poisson(a, awayXg)
      });
    }
  }

  const prob = (
    fn: (h: number, a: number) => boolean
  ) =>
    Math.round(
      scores
        .filter(s => fn(s.h, s.a))
        .reduce((sum, s) => sum + s.p, 0) * 1000
    ) / 10;

  return [
    {
      label: "Home win",
      market: "1X2",
      probability: prob((h, a) => h > a)
    },
    {
      label: "Draw",
      market: "1X2",
      probability: prob((h, a) => h === a)
    },
    {
      label: "Away win",
      market: "1X2",
      probability: prob((h, a) => h < a)
    },
    {
      label: "Over 2.5",
      market: "Over 2.5",
      probability: prob((h, a) => h + a >= 3)
    },
    {
      label: "BTTS Yes",
      market: "BTTS",
      probability: prob((h, a) => h > 0 && a > 0)
    },
    {
      label: "BTTS No",
      market: "BTTS",
      probability: prob((h, a) => h === 0 || a === 0)
    },
    {
      label: "BTTS Yes + Over 2.5",
      market: "BTTS + Total",
      probability: prob(
        (h, a) => h > 0 && a > 0 && h + a >= 3
      )
    },
    {
      label: "BTTS Yes + Under 2.5",
      market: "BTTS + Total",
      probability: prob(
        (h, a) => h > 0 && a > 0 && h + a < 3
      )
    },
    {
      label: "Home win + BTTS Yes",
      market: "1X2 + BTTS",
      probability: prob(
        (h, a) => h > a && h > 0 && a > 0
      )
    },
    {
      label: "Draw + BTTS Yes",
      market: "1X2 + BTTS",
      probability: prob(
        (h, a) => h === a && h > 0
      )
    },
    {
      label: "Away win + BTTS Yes",
      market: "1X2 + BTTS",
      probability: prob(
        (h, a) => a > h && h > 0 && a > 0
      )
    }
  ];
      }
