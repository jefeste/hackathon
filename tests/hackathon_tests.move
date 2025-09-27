
#[test_only]
module hackathon::hackathon_tests;
// uncomment this line to import the module
// use hackathon::hackathon;

const ENotImplemented: u64 = 0;

#[test]
fun test_hackathon() {
    // pass
}

#[test, expected_failure(abort_code = ::hackathon::hackathon_tests::ENotImplemented)]
fun test_hackathon_fail() {
    abort ENotImplemented
}

