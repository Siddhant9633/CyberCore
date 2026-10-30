declare module "zxcvbn" {
  interface ZXCVBNResult {
    score: 0 | 1 | 2 | 3 | 4;
    feedback: {
      warning: string;
      suggestions: string[];
    };
    crack_times_display: {
      online_no_throttling_10_per_second: string;
      online_throttling_100_per_hour: string;
      offline_slow_hashing_1e4_per_second: string;
      offline_fast_hashing_1e10_per_second: string;
    };
  }
  function zxcvbn(password: string, userInputs?: string[]): ZXCVBNResult;
  export default zxcvbn;
}
