export class Attachment {
	constructor(
		readonly id: number,
		readonly name: string,
		readonly size: number,
		readonly key: string,
	) {}
	// converts file size from bytes to human-readable string
	sizeWithUnit(): string {
		if (!this.size) return '0 Bytes'
		var k = 1024,
			dm = 1,
			sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
			i = Math.floor(Math.log(this.size) / Math.log(k))
		return parseFloat((this.size / k ** i).toFixed(dm)) + ' ' + sizes[i]
	}
}
