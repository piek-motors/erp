# Backlog

- [ ] **PDO**: Аdd the ability to configure filters from the UI. Editing of materials must remain disabled.
- [ ] **PDO**: Show detail group and detail id on the printed version of production order.
- [ ] **Architecture**: migrate to a plugin-based architecture to improve domain isolation.
- [ ] **HR**: Timeformers. 
  Move from interval precalculation, to the on-demand interval-formation in order: 
  1. To reduce amount of data stored. 
  2. Mitigate complexities with unclosed and fantom intervals, when some events not emmited or lost, and then uploaded later. Shift duration can be calculated in rust on demand.
  In the result we megrate almost all logic to the rust and this will be more cohesive solution. 
  
  Steps to implement (Estimated 3 days): 
    1. Mesure latency for hmm for current dataset. If it negligible, go forward.
    2. Drop intervals table
    3. Migrate HMM calling to the get rpc and move bussines logic to rust.
    4. Fix interval correction rpcs
    5. Fix frontend
     