<script lang="ts">
	import { SCALES, PROFILE_GROUP_ORDER, TOTAL_FIELDS, SCALE_BY_FIELD } from '$lib/data/scaleMeta';
	import { SCALE_DESCRIPTIONS, GROUP_DESCRIPTIONS, SURVEY_ABOUT, SOURCE_NOTE } from '$lib/data/scaleDescriptions';

	// グループ順に42尺度を並べる（合計4種は最後に別枠）
	const groups = PROFILE_GROUP_ORDER.map((g) => ({
		group: g,
		desc: GROUP_DESCRIPTIONS[g] ?? '',
		rows: SCALES.filter((s) => s.group === g)
	})).filter((x) => x.rows.length > 0);

	const totals = TOTAL_FIELDS.map((f) => SCALE_BY_FIELD.get(f)!);
</script>

<!-- 用語解説（公式「推奨尺度の説明」準拠） -->
<div data-pdf-block class="bg-white rounded-lg shadow-sm p-4 print:break-before-page">
	<h4 class="text-base font-semibold text-gray-900 mb-1">用語解説（各尺度の意味）</h4>
	<p class="text-xs text-gray-500 leading-relaxed mb-3">{SURVEY_ABOUT}</p>

	<div class="grid md:grid-cols-2 gap-x-8 gap-y-3">
		{#each groups as grp}
			<div class="break-inside-avoid">
				<div class="border-b-2 border-primary-200 pb-1 mb-2">
					<span class="text-sm font-bold text-primary-700">{grp.group}</span>
					{#if grp.desc}<span class="text-[11px] text-gray-500 ml-2">{grp.desc}</span>{/if}
				</div>
				<dl class="space-y-1.5">
					{#each grp.rows as s}
						{@const d = SCALE_DESCRIPTIONS[s.field]}
						<div class="grid grid-cols-[7.5rem,1fr] gap-2 text-xs leading-snug">
							<dt class="font-semibold text-gray-800">{s.label}</dt>
							<dd class="text-gray-600">
								{d?.desc ?? ''}
								{#if d?.example}
									<span class="block text-gray-400 mt-0.5">設問例「{d.example}」</span>
								{/if}
							</dd>
						</div>
					{/each}
				</dl>
			</div>
		{/each}

		<!-- 対策領域別合計 -->
		<div class="break-inside-avoid">
			<div class="border-b-2 border-primary-200 pb-1 mb-2">
				<span class="text-sm font-bold text-primary-700">対策領域別合計（4領域）</span>
				<span class="text-[11px] text-gray-500 ml-2">構成する尺度得点の平均。対策の優先領域を見るための指標</span>
			</div>
			<dl class="space-y-1.5">
				{#each totals as s}
					{@const d = SCALE_DESCRIPTIONS[s.field]}
					<div class="grid grid-cols-[7.5rem,1fr] gap-2 text-xs leading-snug">
						<dt class="font-semibold text-gray-800">{s.label.replace('(合計)', '')}</dt>
						<dd class="text-gray-600">{d?.desc ?? ''}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>

	<p class="text-[10px] text-gray-400 mt-3 pt-2 border-t border-gray-100 leading-relaxed">{SOURCE_NOTE}</p>
</div>
