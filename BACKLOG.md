# Backlog

- [ ] **PDO**: Аdd the ability to configure filters from the UI. Editing of materials must remain disabled.
- [ ] **Architecture**: migrate to a plugin-based architecture to improve domain isolation.
- [ ] **HR**: Timeformers. 
  Move from interval precalculation, to the on-demand interval-formation in order: 
  1. To reduce amount of data stored. 
  2. Mitigate complexities with unclosed and fantom intervals, when some events not emmited or lost, and then uploaded later. Shift duration can be calculated in rust on demand.
  In the result we megrate almost all logic to the rust and this will be more cohesive solution. 
  
  Steps to implement (Estimated 3 days): 
    - [x] Mesure latency for hmm for current dataset. If it negligible, go forward. Perf: 8ms on 4.7k events/ 2ms on 1k events/ 1 employee ~ 40 events month / 1000 employees = 40k ~ 80 ms (Negligible latency overhead)
    
    - [ ] Migrate HMM calling to the get rpc and move bussines logic to rust.
    - [ ] Fix interval correction rpcs
    - [ ] Fix frontend

    - [ ] Think about a need for removing near-duplicate events for a single user. (Software surpress already exist)
    - [ ] Drop intervals table
     
- [x] **PDO**: Show detail group and detail id on the printed version of production order.