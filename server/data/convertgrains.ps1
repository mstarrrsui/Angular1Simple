$a=Get-Content $args[0]
$x=[xml] $a
$grainlist = [System.Collections.ArrayList]@()

$x.FERMENTABLES.FERMENTABLE | % {$i=0} {
	$myhash = @{
	    id=$i
		name=$_.name
		countryOfOrigin=$_.origin
		description=$_.notes
		yield=$_.yield
		color=$_.color
		displayColor=$_.display_color
		potential=$_.potential
		coarsefinediff=$_.coarse_fine_diff
		moisture=$_.moisture
		diastaticPower=$_.diastatic_power
		protein=$_.protein
		maxInBatch=$_.MAX_IN_BATCH
		recommendMash=$_.RECOMMEND_MASH
	}
	$grainlist.Add($myhash)
	$i++
}
ConvertTo-Json $grainlist