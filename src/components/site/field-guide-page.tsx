import { Link } from "@tanstack/react-router";
import { SiteChrome } from "./site-chrome";
import { ViewportTip } from "./viewport-tip";
import {
  fieldRecipes,
  TOOL_EXPLAIN,
  TOOL_LABEL,
  TOOL_LEGEND,
  type FieldRecipe,
  type RecipeTool,
} from "./field-guide-data";

function RecipeToolChip({
  tool,
  tipId,
}: {
  tool: RecipeTool;
  tipId: string;
}) {
  const explain = TOOL_EXPLAIN[tool];
  return (
    <ViewportTip
      className={`ac-recipe-tool ac-recipe-tool--${tool}`}
      tipClassName="ac-recipe-tip"
      tipId={tipId}
      label={TOOL_LABEL[tool]}
    >
      <span className="ac-recipe-tip-what">{explain.what}</span>
    </ViewportTip>
  );
}

function RecipeCard({ recipe }: { recipe: FieldRecipe }) {
  return (
    <article className="ac-recipe" id={recipe.id}>
      <header className="ac-recipe-head">
        <span className="ac-recipe-num">{recipe.number}</span>
        <div className="ac-recipe-titles">
          <h2 className="ac-recipe-title">{recipe.title}</h2>
          <p className="ac-recipe-when">{recipe.when}</p>
        </div>
        <RecipeToolChip tool={recipe.tool} tipId={`fg-tip-${recipe.id}`} />
      </header>
      <ol className="ac-recipe-steps">
        {recipe.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="ac-recipe-done">
        <span>Done when</span>
        {recipe.doneWhen}
      </p>
    </article>
  );
}

export function FieldGuidePage() {
  return (
    <SiteChrome loginRedirect="/gnomah">
      <div className="ac-service-page ac-field-guide ac-page-top">
        <div className="ac-service-stack">
          <header className="ac-service-head">
            <span className="ac-service-kicker">Field guide</span>
            <div className="ac-fg-title-row">
              <h1 className="ac-service-title">Recipes for the climb</h1>
              <ul className="ac-recipe-legend" aria-label="The agents">
                {TOOL_LEGEND.map((tool) => (
                  <li key={tool}>
                    <RecipeToolChip
                      tool={tool}
                      tipId={`fg-tip-legend-${tool}`}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="ac-service-lede-box">
              <p className="ac-service-lede">
                Finished write-ups live in the journal. This page is how to
                write one: nine short how-tos. You and whoever builds it use
                the same answers.
              </p>
              <p className="ac-service-lede ac-service-lede--last">
                Write it first. Agents second.
              </p>
            </div>
          </header>

          <div className="ac-recipe-list">
            {fieldRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          <p className="ac-field-guide-foot">
            <Link to="/start">Send a Climb Note</Link>
            <span aria-hidden> · </span>
            <Link to="/climb-notes">Read published Climb Notes</Link>
            <span aria-hidden> · </span>
            <Link to="/service">How we help you climb</Link>
          </p>
        </div>
      </div>
    </SiteChrome>
  );
}
