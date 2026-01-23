export interface Job {
	run(): Promise<void>
	interval(): number
}

export class JobsRunner {
	constructor(private readonly jobs: Job[]) {}

	setup() {
		for (const job of this.jobs) {
			job.run()
			setInterval(() => {
				job.run()
			}, job.interval())
		}
	}
}
